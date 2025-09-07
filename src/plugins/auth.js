function createAuth(router) {
  return {
    get accessToken() {
      return localStorage.getItem('uat');
    },
    set accessToken(token) {
      if (token == null) localStorage.removeItem('uat');
      else localStorage.setItem('uat', token);
    },
    isAuthenticated() {
      return localStorage.getItem('uat') !== null;
    },
    login() {
      const loginURL = new URL('https://id.twitch.tv/oauth2/authorize');
      const params = {
        client_id: 'cd1q55j22rdxm0o3lp2jwy8osgsjn2',
        redirect_uri:
          import.meta.env.DEV ? 'http://localhost:5173/auth' : 'https://bot.mtheb.tv/auth',
        response_type: 'code',
        force_verify: true,
        scope:
          'channel:read:subscriptions channel:read:redemptions channel:read:goals moderation:read channel:manage:redemptions channel:manage:moderators moderator:read:followers',
      };
      Object.keys(params).forEach((key) => loginURL.searchParams.append(key, params[key]));
      window.location.assign(decodeURIComponent(loginURL.href));
    },
    logout() {
      localStorage.removeItem('uat');
      localStorage.removeItem('userData');
      router.push('/');
    },
    getProfileData() {
      return JSON.parse(localStorage.getItem('userData'));
    },
  };
}

export default {
  install(app, { router }) {
    app.config.globalProperties.$auth = createAuth(router);
  },
};
