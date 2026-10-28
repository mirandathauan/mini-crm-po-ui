import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const reqComAuth = req.clone({
    setHeaders: {
      Authorization: 'Basic ' + btoa('admin:99'),
      TenantId: '99,01',
    },
  });

  return next(reqComAuth);
};
