import React, { useEffect, useState } from "react";
import "./Test.css";
import axios from "axios";

function Test() {
  const [user, setUser] = useState({});
  const [bankAccounts, setBankAccounts] = useState([]);
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [canBuy, setCanBuy] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  //   const [marketTrends, setMarketTrends] = useState([]);
  const [topCryptocurrencies, setTopCryptocurrencies] = useState([]);

  useEffect(() => {
    // Fetch user data
    setUser({
      name: "Purva Masurkar",
      email: "purvamasurkar12@gmail.com",
    });

    // Mocked bank account data
    setBankAccounts([
      { id: 1, name: "USA (USD)", currency: "USD", balance: 5000 },
      { id: 2, name: "Indian (INR)", currency: "INR", balance: 2500 },
      { id: 3, name: "Eurozone (EUR)", currency: "EUR", balance: 3000 },
    ]);

    // Fetch real-time cryptocurrency prices
    const fetchCryptoPrices = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,ripple,cardano,polkadot&vs_currencies=usd"
        );
        const prices = Object.keys(response.data).map((currency, index) => ({
          id: index + 1,
          currency: currency.charAt(0).toUpperCase() + currency.slice(1),
          price: response.data[currency].usd,
        }));
        setCryptoPrices(prices);
      } catch (error) {
        console.error("Error fetching cryptocurrency prices:", error);
      }
    };

    // // Fetch real-time market trends
    // const fetchMarketTrends = async () => {
    //   try {
    //     const response = await axios.get(
    //       "https://api.coingecko.com/api/v3/global"
    //     );
    //     setMarketTrends(response.data.data);
    //   } catch (error) {
    //     console.error("Error fetching market trends:", error);
    //   }
    // };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Fetch real-time top-performing cryptocurrencies
    const fetchTopCryptocurrencies = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false"
        );
        setTopCryptocurrencies(response.data);
      } catch (error) {
        console.error("Error fetching top cryptocurrencies:", error);
        // Set top cryptocurrencies to an empty array in case of error
        await delay(5000);
        setTopCryptocurrencies([]);
      }
    };

    fetchCryptoPrices();
    // fetchMarketTrends();
    fetchTopCryptocurrencies();
  }, []);

  useEffect(() => {
    // Check if the user can buy the selected cryptocurrency
    if (selectedCrypto && amount > 0 && selectedAccount) {
      const account = bankAccounts.find(
        (account) =>
          account.name.toLowerCase() === selectedAccount.toLowerCase()
      );
      const crypto = cryptoPrices.find(
        (price) => price.currency.toLowerCase() === selectedCrypto.toLowerCase()
      );
      if (crypto && account && account.balance >= amount * crypto.price) {
        setCanBuy(true);
      } else {
        setCanBuy(false);
      }
    } else {
      setCanBuy(false);
    }
  }, [selectedCrypto, amount, selectedAccount, bankAccounts, cryptoPrices]);

  const handleBuy = () => {
    console.log(amount);

    // Implement buy functionality
    // Update transaction history
    const transaction = {
      id: transactionHistory.length + 1,
      crypto: selectedCrypto,
      amount: amount,
      price: cryptoPrices.find(
        (price) => price.currency.toLowerCase() === selectedCrypto.toLowerCase()
      ).price,
      date: new Date().toLocaleString(),
    };
    setTransactionHistory([...transactionHistory, transaction]);
    // Deduct the amount from the bank account balance
    const updatedBankAccounts = bankAccounts.map((account) => {
      if (account.name.toLowerCase() === selectedAccount.toLowerCase()) {
        return {
          ...account,
          balance: account.balance - amount * transaction.price,
        };
      }
      return account;
    });
    setBankAccounts(updatedBankAccounts);
    // Reset input fields
    setSelectedCrypto("");
    setAmount(0);
    setCanBuy(false);
  };

  return (
    <>
      <section id="content">
        {/* <nav>
          <i class="bx bx-menu"></i>
          <a href="#" class="nav-link">
            Categories
          </a>
          <form action="#">
            <div class="form-input">
              <input type="search" placeholder="Search..." />
              <button type="submit" class="search-btn">
                <i class="bx bx-search"></i>
              </button>
            </div>
          </form>
          <input type="checkbox" id="switch-mode" hidden />
          <label for="switch-mode" class="switch-mode"></label>
          <a href="#" class="notification">
            <i class="bx bxs-bell"></i>
            <span class="num">8</span>
          </a>
          <a href="#" class="profile">
            <img src="img/people.png" />
          </a>
        </nav> */}
        <main>
          <div class="head-title">
            <div class="left">
              <h1 style={{ textAlign: "left" }}>Welcome</h1>
              <ul class="breadcrumb">
                <li>
                  <a href="#">purvamasurkar12@gmail.com</a>
                </li>
                <li>
                  <i class="bx bx-chevron-right"></i>
                </li>
              </ul>
            </div>
          </div>

          <ul class="box-info">
            <li>
              <i class="bx bx-dollar"></i>
              <span class="text">
                <h3>$ {bankAccounts[0]?.balance}</h3>
                <p>USA (USD)</p>
              </span>
            </li>
            <li>
              <i class="bx bx-rupee"></i>
              <span class="text">
                <h3>Rs {bankAccounts[1]?.balance}</h3>
                <p>Indian (INR)</p>
              </span>
            </li>
            <li>
              <i class="bx bx-euro"></i>
              <span class="text">
                <h3>EUR {bankAccounts[2]?.balance}</h3>
                <p>Eurozone (EUR)</p>
              </span>
            </li>
          </ul>

          <div class="table-data">
            <div class="order">
              <div class="head">
                <h3>Trading Panel</h3>
              </div>
              <div
                className="panel-ctrl"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="cnt">
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    <option value="">Select an account</option>
                    {bankAccounts.map((account) => (
                      <option
                        key={account.id}
                        value={account.name.toLowerCase()}
                      >
                        {account.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedCrypto}
                    onChange={(e) => setSelectedCrypto(e.target.value)}
                  >
                    <option value="">Select a cryptocurrency</option>
                    {cryptoPrices.map((crypto) => (
                      <option
                        key={crypto.id}
                        value={crypto.currency.toLowerCase()}
                      >
                        {crypto.currency}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="Enter amount"
                  />
                  <button onClick={handleBuy} disabled={!canBuy}>
                    Buy
                  </button>
                </div>
              </div>
            </div>
            <div class="todo">
              <div class="head">
                <h3>Top Performing Cryptocurrencies</h3>
              </div>
              <ul class="todo-list">
                {topCryptocurrencies.map((crypto) => (
                  <li key={crypto.id} class="completed">
                    <p>
                      {crypto.name}: ${crypto.current_price}
                    </p>
                    <i class="bx bx-dots-vertical-rounded"></i>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div class="table-data">
            <div class="transactions">
              <div class="head">
                <h3>Transaction History</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>CryptoCurrency</th>
                    <th>Price Per Crypto</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.crypto}</td>
                      <td>${transaction.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}

export default Test;
