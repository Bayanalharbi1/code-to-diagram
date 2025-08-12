export class User {
  id: string = "";
  login(username: string, password: string): boolean { return true; }
}
export class Admin extends User {
  ban(userId: string): boolean { return true; }
}
export function main(){ loginService(); }
export function loginService(){ saveLog(); }
export function saveLog(){ return; }
