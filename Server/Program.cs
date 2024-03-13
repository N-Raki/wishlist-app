using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Serilog;
using Server;
using Server.Extensions;
using Server.Helpers;
using Server.Mappers;
using Server.Mappers.Contracts;
using Server.Models;
using Server.Providers;
using Server.Providers.Contracts;
using Server.Repositories;
using Server.Repositories.Contracts;
using Server.Services;
using Server.Services.Contracts;

var builder = WebApplication.CreateBuilder(args);

// Serilog implementation
var logger = new LoggerConfiguration()
	.ReadFrom.Configuration(builder.Configuration)
	.Enrich.FromLogContext()
	.CreateLogger();
builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

builder.Services.AddScoped<IUserMapper, UserMapper>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IUsersRepository, UsersRepository>();

builder.Services.AddScoped<IWishlistMapper, WishlistMapper>();
builder.Services.AddScoped<IWishlistsService, WishlistsService>();
builder.Services.AddScoped<IWishlistsRepository, WishlistsRepository>();

builder.Services.AddScoped<IItemMapper, ItemMapper>();
builder.Services.AddScoped<IItemsService, ItemsService>();
builder.Services.AddScoped<IItemsRepository, ItemsRepository>();

builder.Services.AddScoped<IAuthenticationDataProvider, AuthenticationDataProvider>();

// Add emails sender
builder.Services.AddScoped<IEmailSender<User>, EmailSender>();

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
	options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme).AddIdentityCookies();
builder.Services.ConfigureApplicationCookie(options =>
{
	options.Cookie.HttpOnly = true;
	options.Cookie.SameSite = SameSiteMode.None;
	options.ExpireTimeSpan = TimeSpan.FromDays(14);
	
	options.Events = new CookieAuthenticationEvents
	{
		OnRedirectToLogin = context =>
		{
			context.Response.StatusCode = 401;
			return Task.CompletedTask;
		}
	};
});
builder.Services.AddAuthorizationBuilder();

builder.Services.AddDbContext<DatabaseContext>(options => options.UseLazyLoadingProxies().UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<User>().AddEntityFrameworkStores<DatabaseContext>().AddApiEndpoints();

builder.Services.Configure<IdentityOptions>(options =>
{
	options.User.RequireUniqueEmail = true;
	options.Password.RequireDigit = false;
	options.Password.RequireLowercase = false;
	options.Password.RequireUppercase = false;
	options.Password.RequireNonAlphanumeric = false;
	options.Password.RequiredLength = 6;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();

	app.UseCors(corsPolicyBuilder => corsPolicyBuilder
		.WithOrigins("https://localhost:8000")
		.AllowAnyMethod()
		.AllowAnyHeader()
		.AllowCredentials());
	
	app.ApplyMigrations();
}
else
{
	app.UseCors(corsPolicyBuilder => corsPolicyBuilder
		.WithOrigins("https://wishlist.raki.app")
		.AllowAnyMethod()
		.AllowAnyHeader()
		.AllowCredentials());
	
	app.ApplyMigrations();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
