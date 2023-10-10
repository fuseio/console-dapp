# Connectors

Wagmi currently doesn't allow variable ids, they are using `readonly id`, and Web3Auth Wagmi Connector doesn't export multiple connector instances, so we are restricted to using only one social login.

Connectors is a solution to create Web3Auth Wagmi connector instance for all social logins. It's a fork of [web3auth-wagmi-connector connector.ts](https://github.com/Web3Auth/web3auth-wagmi-connector/blob/9aee8dbb2928a87c9eff645bf85d10a92ed3339e/src/lib/connector.ts).
