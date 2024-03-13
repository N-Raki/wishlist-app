using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Identity;
using Server.Models;
using Server.Models.Options;

namespace Server.Helpers;

public sealed class EmailSender(IConfiguration configuration) : IEmailSender<User>
{
    public Task SendConfirmationLinkAsync(User user, string email, string confirmationLink)
    {
        throw new NotImplementedException();
    }

    public async Task SendPasswordResetLinkAsync(User user, string email, string resetLink)
    {
        await SendEmailAsync(email, "Password reset code", $"Click here to reset your password: {resetLink}");
    }

    public Task SendPasswordResetCodeAsync(User user, string email, string resetCode)
    {
        throw new NotImplementedException();
    }

    private async Task SendEmailAsync(string email, string subject, string message)
    {
        var emailOptions = configuration.GetSection(EmailOptions.Email).Get<EmailOptions>();
        if (emailOptions is null)
        {
            throw new InvalidOperationException("Email options are not configured");
        }
        
        var client = new SmtpClient(emailOptions.SmtpServer, emailOptions.SmtpPort)
        {
            Credentials = new NetworkCredential(emailOptions.SmtpUsername, emailOptions.SmtpPassword),
            EnableSsl = true
        };

        await client.SendMailAsync(new MailMessage
        {
            From = new MailAddress(emailOptions.SmtpUsername),
            To = { email },
            Subject = subject,
            Body = message
        });
    }
}