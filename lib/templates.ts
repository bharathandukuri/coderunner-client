export interface LanguageConfig {
  id: number
  name: string
  defaultCode: string
  monacoLanguage?: string
}

export const LANGUAGE_TEMPLATES: Record<number, string> = {
  1: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}
`,
  2: `#include <iostream>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}
`,
  3: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}
`,
  4: `console.log("Hello from JavaScript!");
`,
  5: `def main():
    print("Hello from Python!")

if __name__ == "__main__":
    main()
`,
  6: `const greeting: string = "Hello from TypeScript!";
console.log(greeting);
`,
  7: `-- SQLite 3
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users (name) VALUES ('Alice'), ('Bob');
SELECT * FROM users;
`,
  8: `-- PostgreSQL 16
CREATE TABLE employees (id SERIAL PRIMARY KEY, name VARCHAR(50), role VARCHAR(50));
INSERT INTO employees (name, role) VALUES ('Alice', 'Engineer'), ('Bob', 'Designer');
SELECT * FROM employees;
`,
  9: `-- MySQL 8.4
CREATE TABLE products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), price DECIMAL(10,2));
INSERT INTO products (name, price) VALUES ('Keyboard', 49.99), ('Mouse', 19.99);
SELECT * FROM products;
`,
  10: `// MongoDB 8.0
db.users.insertOne({ name: "Alice", role: "Developer" });
db.users.find();
`,
}
