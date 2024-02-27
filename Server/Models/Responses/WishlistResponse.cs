﻿namespace Server.Models.Responses;

public sealed class WishlistResponse
{
	public Guid Id { get; init; }
	public string Name { get; init; } = string.Empty;
	public IEnumerable<ItemResponse> Items { get; init; } = new List<ItemResponse>(); 
}
