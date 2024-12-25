using Microsoft.AspNetCore.Identity;
using Server.Models;

namespace Server.Helpers;

public interface IEmailSender : IEmailSender<User>
{
    public Task SendEmailAsync(string email, string subject, string message);
}