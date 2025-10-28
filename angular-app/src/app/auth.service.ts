// // import { Injectable } from '@angular/core';
// // import { Observable, of, throwError } from 'rxjs';
// // import { delay, tap } from 'rxjs/operators';

// //--------------------> Normal Login 
// // @Injectable({ providedIn: 'root' })
// // export class AuthService {
// //   private loggedIn = false;

// //   login(username: string, password: string): boolean {
// //     if (username === 'admin' && password === 'admin') {
// //       this.loggedIn = true;
// //       return true;
// //     }
// //     return false;
// //   }

// //   logout(): void {
// //     this.loggedIn = false;
// //   }

// //   isLoggedIn(): boolean {
// //     return this.loggedIn;
// //   }
// // }


// //--------------------------->Login USING HTTP CLIENT AND STORING PASSWORD IN LOCAL STORAGE A A PRATICULAR SEESION 


// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {
// //   private loggedIn = false;

// //   constructor() {
// //     // Load login state from localStorage when service starts
// //     const savedLogin = localStorage.getItem('isLoggedIn');
// //     this.loggedIn = savedLogin === 'true';
// //   }

// //   login(username: string, password: string, rememberMe = false): Observable<boolean> {
// //     if (username === 'admin' && password === 'admin') {
// //       return of(true).pipe(
// //         delay(1500),
// //         tap(() => {
// //           this.loggedIn = true;
// //           if (rememberMe) {
// //             localStorage.setItem('isLoggedIn', 'true');
// //           }
// //         })
// //       );
// //     } else {
// //       return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
// //     }
// //   }

// //   logout(): void {
// //     this.loggedIn = false;
// //     localStorage.removeItem('isLoggedIn');
// //   }

// //   isLoggedIn(): boolean {
// //     return this.loggedIn;
// //   }
// // }

// //--------------------------------->UPDATING LOCAL STORAGE TO STORE DATA IN LOCAL STORAGE OF REGISTRATION FORM 
// // import { Injectable } from '@angular/core';
// // import { Observable, of, throwError } from 'rxjs';
// // import { delay, tap } from 'rxjs/operators';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthService {
// //   private loggedInUser: any = null;

// //   constructor() {
// //     // Load user if already logged in
// //     const savedUser = localStorage.getItem('loggedInUser');
// //     if (savedUser) {
// //       this.loggedInUser = JSON.parse(savedUser);
// //     }
// //   }

// //   register(name: string, email: string, username: string, password: string): Observable<boolean> {
// //     const users = this.getUsers();

// //     const existing = users.find(u => u.username === username || u.email === email);
// //     if (existing) {
// //       return throwError(() => new Error('User already exists!'));
// //     }

// //     users.push({ name, email, username, password });
// //     localStorage.setItem('users', JSON.stringify(users));

// //     return of(true).pipe(delay(1000));
// //   }

// //   login(username: string, password: string, rememberMe = false): Observable<boolean> {
// //     const users = this.getUsers();
// //     const user = users.find(u => u.username === username && u.password === password);

// //     if (user) {
// //       return of(true).pipe(
// //         delay(1000),
// //         tap(() => {
// //           this.loggedInUser = user;

// //           // If rememberMe is checked, store in localStorage
// //           if (rememberMe) {
// //             localStorage.setItem('loggedInUser', JSON.stringify(user));
// //           }
// //         })
// //       );
// //     }

// //     return throwError(() => new Error('Invalid username or password')).pipe(delay(1000));
// //   }

// //   logout(): void {
// //     this.loggedInUser = null;
// //     localStorage.removeItem('loggedInUser');
// //   }

// //   isLoggedIn(): boolean {
// //     return !!this.loggedInUser;
// //   }

// //   getCurrentUser() {
// //     return this.loggedInUser;
// //   }

// //   private getUsers(): any[] {
// //     const usersJson = localStorage.getItem('users');
// //     return usersJson ? JSON.parse(usersJson) : [];
// //   }
// // }
// import { Injectable } from '@angular/core';
// import { Observable, of, throwError } from 'rxjs';
// import { delay } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private users: any[] = JSON.parse(localStorage.getItem('users') || '[]');
//   private loggedInUser: any =
//     JSON.parse(localStorage.getItem('loggedInUser') || 'null') ||
//     JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');

//   /**
//    * Login user and optionally remember them across sessions
//    */
//   login(username: string, password: string, rememberMe = false): Observable<boolean> {
//     const user = this.users.find(u => u.username === username && u.password === password);
//     if (user) {
//       this.loggedInUser = user;

//       // ✅ Save session depending on Remember Me option
//       if (rememberMe) {
//         localStorage.setItem('loggedInUser', JSON.stringify(user));
//       } else {
//         sessionStorage.setItem('loggedInUser', JSON.stringify(user));
//       }

//       return of(true).pipe(delay(800));
//     }

//     return throwError(() => new Error('Invalid username or password'));
//   }

//   /**
//    * Register a new user
//    */
//   register(user: any): Observable<boolean> {
//     const exists = this.users.some(u => u.username === user.username);
//     if (exists) {
//       return throwError(() => new Error('User already exists'));
//     }

//     this.users.push(user);
//     localStorage.setItem('users', JSON.stringify(this.users));
//     return of(true).pipe(delay(800));
//   }

//   /**
//    * Get the currently logged-in user
//    */
//   getLoggedInUser(): any {
//     return this.loggedInUser;
//   }

//   /**
//    * Update profile details for logged-in user
//    */
//   updateProfile(updatedUser: any): Observable<boolean> {
//     if (!this.loggedInUser) {
//       return throwError(() => new Error('Not logged in'));
//     }

//     // update local users list
//     this.users = this.users.map(u =>
//       u.username === this.loggedInUser.username ? { ...u, ...updatedUser } : u
//     );

//     // update logged-in user
//     this.loggedInUser = { ...this.loggedInUser, ...updatedUser };

//     // persist changes
//     localStorage.setItem('users', JSON.stringify(this.users));

//     if (localStorage.getItem('loggedInUser')) {
//       localStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
//     } else {
//       sessionStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
//     }

//     return of(true).pipe(delay(500));
//   }

//   /**
//    * Logout the user
//    */
//   logout() {
//     this.loggedInUser = null;
//     localStorage.removeItem('loggedInUser');
//     sessionStorage.removeItem('loggedInUser');
//   }

//   /**
//    * Check if user is logged in
//    */
//   isLoggedIn(): boolean {
//     return !!this.loggedInUser;
//   }

//     /**
//    * Restore user session from localStorage or sessionStorage
//    */
//   restoreSession() {
//     const savedUser =
//       JSON.parse(localStorage.getItem('loggedInUser') || 'null') ||
//       JSON.parse(sessionStorage.getItem('loggedInUser') || 'null');

//     if (savedUser) {
//       this.loggedInUser = savedUser;
//     }
//   }
// }
