/// <reference path="../.sst/platform/config.d.ts" />

const secrets = [
  new sst.Secret("GOOGLE_CLIENT_ID"),
  new sst.Secret("GOOGLE_CLIENT_SECRET"),
  new sst.Secret("GITHUB_CLIENT_ID"),
  new sst.Secret("GITHUB_CLIENT_SECRET"),
  new sst.Secret("AUTH_SECRET"),
  new sst.Secret("BASE_URL"),
];

secrets.forEach((s) => s.name.apply((k) => s.value.apply((v) => console.log(`${k}=${v}`))));

export { secrets };
