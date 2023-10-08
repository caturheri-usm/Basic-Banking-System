class BankAccount {
  constructor() {
    this.balance = 0;
  }

  deposit(amount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.balance += amount;
        resolve(`Deposit berhasil. Saldo Anda sekarang: ${this.balance}`);
      }, 2000); // Menggunakan setTimeout untuk mensimulasikan operasi yang berlangsung selama 2 detik.
    });
  }

  withdraw(amount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount <= this.balance) {
          this.balance -= amount;
          resolve(`Penarikan berhasil. Saldo Anda sekarang: ${this.balance}`);
        } else {
          reject("Saldo tidak mencukupi untuk melakukan penarikan.");
        }
      }, 2000); // Menggunakan setTimeout untuk mensimulasikan operasi yang berlangsung selama 2 detik.
    });
  }

  checkBalance() {
    return `Saldo Anda saat ini adalah: ${this.balance}`;
  }
}

module.exports = BankAccount;