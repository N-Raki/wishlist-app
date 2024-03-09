FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

ARG BUILD_CONFIGURATION=Release
RUN dotnet dev-certs https --clean
RUN dotnet dev-certs https -t

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c $BUILD_CONFIGURATION -o out

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Server.dll"]