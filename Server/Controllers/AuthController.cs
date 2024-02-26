using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Models.Requests;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly EmailAddressAttribute _emailAddressAttribute = new();
    
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
        var result = await signInManager.PasswordSignInAsync(user, loginRequest.Password, true, true);
        
        if (!result.Succeeded)
        {
            return TypedResults.Problem(result.ToString(), statusCode: StatusCodes.Status401Unauthorized);
        }
        
        // The signInManager already produced the needed response in the form of a cookie.
        return TypedResults.Empty;
    }
    
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Login([FromServices] IServiceProvider serviceProvider)
    {
        var signInManager = serviceProvider.GetRequiredService<SignInManager<User>>();
        await signInManager.SignOutAsync().ConfigureAwait(false);
        return Ok();
    }
    
    private static ValidationProblem CreateValidationProblem(IdentityResult identityResult)
    {
        Debug.Assert(!identityResult.Succeeded);
        
        var errorDictionary = new Dictionary<string, string[]>();
        
        foreach (var error in identityResult.Errors)
        {
            string[] newDescriptions;
            
            if (!errorDictionary.TryGetValue(error.Code, out var descriptions))
            {
                if (descriptions is null) continue;
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