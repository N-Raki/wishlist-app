using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Server.Models;
using Server.Models.Options;
using Server.Models.Requests;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IConfiguration configuration) : ControllerBase
{
    private readonly EmailAddressAttribute _emailAddressAttribute = new();
    
    private readonly NetworkOptions? _networkOptions = configuration.GetSection(NetworkOptions.Network).Get<NetworkOptions>();
    
    [HttpPost("register")]
    public async Task<Results<Ok, ValidationProblem>> Register([FromBody] RegisterRequest registerRequest, [FromServices] IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        if (!userManager.SupportsUserEmail)
        {
            throw new NotSupportedException($"{nameof(Register)} requires a user store with email support.");
        }
        
        var userStore = serviceProvider.GetRequiredService<IUserStore<User>>();
        var emailStore = (IUserEmailStore<User>)userStore;
        var email = registerRequest.Email;
        
        if (string.IsNullOrEmpty(email) || !_emailAddressAttribute.IsValid(email))
        {
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(email)));
        }

        var user = new User();
        
        await userStore.SetUserNameAsync(user, registerRequest.Email, CancellationToken.None);
        await emailStore.SetEmailAsync(user, registerRequest.Email, CancellationToken.None);
        
        user.DisplayName = registerRequest.DisplayName;
        
        var result = await userManager.CreateAsync(user, registerRequest.Password);

        if (!result.Succeeded)
        {
            return CreateValidationProblem(result);
        }
        
        var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
        signInManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;
        
        await signInManager.PasswordSignInAsync(user, registerRequest.Password, false, true);
            
        return TypedResults.Ok();
    }
    
    [HttpPost("login")]
    public async Task<Results<Ok<AccessTokenResponse>, EmptyHttpResult, ProblemHttpResult>> Login([FromBody] LoginRequest loginRequest, [FromServices] IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(loginRequest.Email);
        
        var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
        signInManager.AuthenticationScheme = IdentityConstants.ApplicationScheme;
        
        if (user is null)
        {
            return TypedResults.Problem("User not found.", statusCode: StatusCodes.Status401Unauthorized);
        }
        var result = await signInManager.PasswordSignInAsync(user, loginRequest.Password, loginRequest.RememberMe, true);
        
        if (!result.Succeeded)
        {
            return TypedResults.Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);
        }
        
        // The signInManager already produced the needed response in the form of a cookie.
        return TypedResults.Empty;
    }

    [HttpPost("signin-google")]
    public async Task<IActionResult> GoogleLogin([FromServices] IServiceProvider serviceProvider, [FromBody] GoogleSignInRequest request)
    {
        var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        
        // Getting the payload from the Google token
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);
        if (payload is null) return Unauthorized();

        const string loginProvider = "Google";
        var claimsPrincipal = new ClaimsPrincipal();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, payload.Subject),
            new(ClaimTypes.Email, payload.Email),
            new(ClaimTypes.Name, payload.Name),
            new(ClaimTypes.GivenName, payload.GivenName),
            new(ClaimTypes.Surname, payload.FamilyName)
        };
        claimsPrincipal.AddIdentity(new ClaimsIdentity(claims, loginProvider));
        
        var externalLoginInfo = new ExternalLoginInfo(claimsPrincipal, loginProvider, payload.Subject, payload.Name);

        // If the user is already signed in, return
        var signInResult = await signInManager.ExternalLoginSignInAsync(externalLoginInfo.LoginProvider, externalLoginInfo.ProviderKey, true);
        if (signInResult.Succeeded) { return Ok(); }
        
        var email = payload.Email;
        if (string.IsNullOrEmpty(email)) return BadRequest();

        // Get the user by email
        var user = await userManager.FindByEmailAsync(email);
        
        // If the user does not exist, create a new user
        if (user == null)
        {
            var displayName = !string.IsNullOrWhiteSpace(payload.GivenName) && !string.IsNullOrWhiteSpace(payload.FamilyName)
                ? $"{payload.GivenName} {payload.FamilyName[0]}"
                : payload.Name;
            user = new User { UserName = email, Email = email, DisplayName = displayName };
            await userManager.CreateAsync(user);
        }
        await userManager.AddLoginAsync(user, externalLoginInfo);
        await signInManager.SignInAsync(user, true);

        return Ok();
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout([FromServices] IServiceProvider serviceProvider)
    {
        var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
        await signInManager.SignOutAsync().ConfigureAwait(false);
        return Ok();
    }
    
    [Authorize]
    [HttpPost("changePassword")]
    public async Task<Results<Ok, ValidationProblem>> ChangePassword([FromBody] ChangePasswordRequest changePasswordRequest, [FromServices] IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.GetUserAsync(HttpContext.User);
        
        if (user is null)
        {
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidToken()));
        }
        
        var isPasswordValid = await userManager.CheckPasswordAsync(user, changePasswordRequest.CurrentPassword);
        if (!isPasswordValid)
        {
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.PasswordMismatch()));
        }
        
        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var result = await userManager.ResetPasswordAsync(user, token, changePasswordRequest.NewPassword);
        
        if (!result.Succeeded)
        {
            return CreateValidationProblem(result);
        }
        
        return TypedResults.Ok();
    }
    
    [HttpPost("forgotPassword")]
    public async Task<Results<Ok, ValidationProblem>> ForgotPassword([FromBody] ForgotPasswordRequest forgotPasswordRequest, [FromServices] IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(forgotPasswordRequest.Email);
        
        if (user is null)
        {
            // Do not reveal that the user does not exist
            await Task.Delay(new Random().Next(500, 650));
            return TypedResults.Ok();
        }
        
        var code = await userManager.GeneratePasswordResetTokenAsync(user);
        code = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(code));
        
        if (_networkOptions is null)
        {
            throw new InvalidOperationException("NetworkOptions is not configured.");
        }
        var resetPasswordLink = $"{_networkOptions.ClientUrl}/resetPassword?email={forgotPasswordRequest.Email}&resetCode={code}";
        
        
        var emailSender = serviceProvider.GetRequiredService<IEmailSender<User>>();
        await emailSender.SendPasswordResetLinkAsync(user, forgotPasswordRequest.Email, resetPasswordLink);
        
        return TypedResults.Ok();
    }
    
    [HttpPost("resetPassword")]
    public async Task<Results<Ok, ValidationProblem>> ResetPassword([FromBody] ResetPasswordRequest resetPasswordRequest, [FromServices] IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(resetPasswordRequest.Email);
        
        if (user is null)
        {
            return CreateValidationProblem(IdentityResult.Failed(userManager.ErrorDescriber.InvalidEmail(resetPasswordRequest.Email)));
        }
        
        var code = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(resetPasswordRequest.ResetCode));
        var result = await userManager.ResetPasswordAsync(user, code, resetPasswordRequest.NewPassword);
        
        if (!result.Succeeded)
        {
            return CreateValidationProblem(result);
        }
        
        return TypedResults.Ok();
    }
    
    private static ValidationProblem CreateValidationProblem(IdentityResult identityResult)
    {
        Debug.Assert(!identityResult.Succeeded);
        
        var errorDictionary = new Dictionary<string, string[]>();
        
        foreach (var error in identityResult.Errors)
        {
            string[] newDescriptions;
            
            if (errorDictionary.TryGetValue(error.Code, out var descriptions))
            {
                newDescriptions = new string[descriptions.Length + 1];
                Array.Copy(descriptions, newDescriptions, descriptions.Length);
                newDescriptions[descriptions.Length] = error.Description;
            }
            else
            {
                newDescriptions = [error.Description];
            }
            
            errorDictionary[error.Code] = newDescriptions;
        }
        
        return TypedResults.ValidationProblem(errorDictionary);
    }
}