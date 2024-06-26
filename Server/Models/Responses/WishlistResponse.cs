﻿namespace Server.Models.Responses;

public sealed class WishlistResponse
{
	public Guid Id { get; init; }
	public Guid UserId { get; init; }
   public string OwnerName { get; init; } = string.Empty;
	public string Name { get; init; } = string.Empty;
   public DateTime CreatedAt { get; init; }
	public IEnumerable<ItemResponse> Items { get; init; } = new List<ItemResponse>();
	public bool IsOwner { get; set; }
}
