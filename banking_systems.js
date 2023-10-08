const readline = require('readline');
const BankAccount = require('./proyek/bank_account');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function main() {
  const account = new BankAccount();

  while (true) {
    const option = await ask("Pilih opsi:\n1. Deposit\n2. Withdraw\n3. Check Balance\nKetik nomor opsi (1/2/3) atau ketik 'exit' untuk keluar:");

    if (option === "exit") {
      break;
    }

    switch (option) {
      case "1":
        const depositAmount = parseFloat(await ask("Masukkan jumlah uang yang ingin Anda depositkan:"));
        if (!isNaN(depositAmount) && depositAmount >= 0) {
          try {
            const depositResult = await account.deposit(depositAmount);
            console.log(depositResult);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Masukkan jumlah deposit yang valid.");
        }
        break;

      case "2":
        const withdrawAmount = parseFloat(await ask("Masukkan jumlah uang yang ingin Anda tarik:"));
        if (!isNaN(withdrawAmount) && withdrawAmount >= 0) {
          try {
            const withdrawResult = await account.withdraw(withdrawAmount);
            console.log(withdrawResult);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Masukkan jumlah penarikan yang valid.");
        }
        break;

      case "3":
        const balance = account.checkBalance();
        console.log(balance);
        break;

      default:
        console.log("Opsi tidak valid. Silakan pilih opsi yang valid.");
    }
  }

  rl.close();
}

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

main();
