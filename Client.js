function Client() {
  this.available = 0
  this.held = 0
  this.locked = false
  this.transactions = []
}

Client.prototype.addTransaction = function (transaction) {
  this.transactions.push(transaction)
}

Client.prototype.handleDeposit = function (transaction) {
  this.available += Number(transaction.amount)
  this.addTransaction(transaction)
}

Client.prototype.handleWithdrawal = function (transaction) {
  const amount = Number(transaction.amount)
  if (this.available >= amount) {
    this.available -= amount
    this.addTransaction(transaction)
  }
}

Client.prototype.handleDispute = function (transaction) {
  const foundTransaction = this.transactions.find(
    (trx) => trx.tx === transaction.tx && (trx.type === 'deposit' || trx.type !== 'withdrawal')
  )
  if (foundTransaction) {
    this.available -= Number(foundTransaction.amount)
    this.held += Number(foundTransaction.amount)
    this.addTransaction(transaction)
    // What if available amount is less than disputed amount?
    // what if disputed transaction was discarded? (ie. a withdrawal that was over available limit)
  }
}

Client.prototype.handleResolution = function (transaction) {
  const foundTransaction = this.transactions.find(
    (trx) => trx.tx === transaction.tx && (trx.type === 'deposit' || trx.type !== 'withdrawal')
  )

  const wasDisputed = this.transactions.find(
    (trx) => trx.tx === transaction.tx && trx.type === 'dispute'
  )

  if (foundTransaction && wasDisputed) {
    this.held -= Number(foundTransaction.amount)
    this.available += Number(foundTransaction.amount)
    this.addTransaction(transaction)
  }
}

Client.prototype.handleChargebacks = function (transaction) {
  const foundTransaction = this.transactions.find(
    (trx) => trx.tx === transaction.tx && (trx.type === 'deposit' || trx.type !== 'withdrawal')
  )

  const wasDisputed = this.transactions.find(
    (trx) => trx.tx === transaction.tx && trx.type === 'dispute'
  )
  if (foundTransaction && wasDisputed) {
    this.held -= Number(foundTransaction.amount)
    this.locked = true
    this.addTransaction(transaction)
  }
}

module.exports = Client
