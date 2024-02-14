using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server;

internal sealed class DatabaseContext(DbContextOptions<DatabaseContext> options) : IdentityDbContext<User>(options);
