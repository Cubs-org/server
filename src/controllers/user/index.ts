export class User {

    name: string = '';
    password: string = '';
    email: string = '';
    icon: string = '';

    async getName() {
        return this.name;
    }

    async getPassword() {
        return this.password;
    }

    async getEmail() {
        return this.email;
    }

    async getIcon() {
        return this.icon;
    }

    async setName(name: string) {
        this.name = name;
    }

    async setPassword(password: string) {
        this.password = password;
    }

    async setEmail(email: string) {
        this.email = email;
    }

    async setIcon(icon: string) {
        this.icon = icon;
    }
}