FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ProductsBackend/ProductsBackend.csproj", "ProductsBackend/"]
RUN dotnet restore "ProductsBackend/ProductsBackend.csproj"

COPY . .
WORKDIR "/src/ProductsBackend"
RUN dotnet publish "./ProductsBackend.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish ./

USER $APP_UID
EXPOSE 8080

ENTRYPOINT ["dotnet", "ProductsBackend.dll"]