using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public sealed class User
{
	public Guid Guid { get; }
	[MaxLength(30)] public string Username { get; init; } = string.Empty;
}
