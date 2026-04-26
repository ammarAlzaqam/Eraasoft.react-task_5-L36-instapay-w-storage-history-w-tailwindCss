import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { BsEye } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { FaAmazonPay, FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as createId } from "uuid";

const DBPassword = "123456";

const App = () => {
  const [balance, setBalance] = useState(+localStorage.getItem("balance") || 0);
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || [],
  );

  const [showBalance, setShowBalance] = useState(
    !!+localStorage.getItem("showBalance") || false,
  );
  const [errorMsg, setErrorMsg] = useState("");
  const amountInput = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("showBalance", showBalance ? 1 : 0);
  }, [showBalance]);

  useEffect(() => {
    localStorage.setItem("balance", +balance);
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const changeAmount = (actionType, isVerified) => {
    const amount = amountInput.current.value;

    if (+amount <= 0) {
      setErrorMsg("Enter a valid amount ( >0 )");
      return;
    }

    setErrorMsg("");

    if (showBalance || isVerified) {
      if (actionType === "deposit") {
        setBalance(balance + +amount);
        amountInput.current.value = "";
        const newTransaction = {
          id: createId(),
          type: actionType,
          amount: amount,
          balanceAfter: balance + +amount,
          createdAt: dayjs().format("DD/MM/YYYY - HH:mm"),
        };
        setTransactions([newTransaction, ...transactions]);
        toast.success("Successfully added.");
      } else if (actionType === "withdraw" && balance >= amount) {
        setBalance(balance - +amount);
        amountInput.current.value = "";
        const newTransaction = {
          id: createId(),
          type: actionType,
          amount: amount,
          balanceAfter: balance - +amount,
          createdAt: dayjs().format("DD/MM/YYYY - HH:mm"),
        };
        setTransactions([newTransaction, ...transactions]);
        toast.success("Successfully withdrawn.");
      } else if (balance < amount) {
        setErrorMsg("Don't have enough balance");
      }
    } else {
      document.getElementById("verify_password_modal2").showModal();
      navigate(`?actionType=${actionType}`);
    }
  };

  return (
    <section className="flex justify-center min-h-dvh items-start pt-10">
      <div className="container flex flex-col gap-4">
        {/*//! Logo and app name */}
        <h1 className="text-3xl text-blue-400 bg-base-200 rounded-2xl py-2 flex items-center justify-center gap-2">
          <FaAmazonPay />
          Instapay
        </h1>
        <div className="flex justify-between items-start">
          {/*//! Left Balance Action */}
          <div className="flex flex-col gap-2 grow">
            {/*//! Welcome & Balance */}
            <div>
              <h2 className="text-xl">Welcome : Ammar Alzaqam</h2>
              <div className="text-lg flex items-center gap-2">
                <span>
                  Your Balance : {showBalance ? `${balance} EGP` : "----"}{" "}
                </span>
                {showBalance ? (
                  <FaRegEyeSlash onClick={() => setShowBalance(false)} />
                ) : (
                  <BsEye
                    onClick={() =>
                      document
                        .getElementById("verify_password_modal")
                        .showModal()
                    }
                  />
                )}

                {/*//! Verify Password Modal */}
                <VerifyPasswordModal setShowBalance={setShowBalance} />
              </div>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <div className="">
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your amount"
                  ref={amountInput}
                />
                {errorMsg ? (
                  <p className="text-red-500 mt-1">{errorMsg}</p>
                ) : (
                  ""
                )}
              </div>
              {/*//! Action btns */}
              <div className="flex gap-2">
                <button
                  className="btn btn-success text-black text-sm"
                  onClick={() => changeAmount("deposit")}
                >
                  Deposit
                </button>
                <button
                  className="btn btn-error text-black text-sm"
                  onClick={() => changeAmount("withdraw")}
                >
                  Withdraw
                </button>
                {/*//! Verify password modal */}
                <VerifyPasswordModal2
                  setShowBalance={setShowBalance}
                  changeAmount={changeAmount}
                />
              </div>
            </div>
          </div>
          {/*//! Right History table */}
          <table className="table w-fit">
            <thead>
              <tr>
                <th>Id</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date</th>
                <th>Act</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id}>
                  <td>
                    <p className="max-w-20 line-clamp-1">{t.id}</p>
                  </td>
                  <td>{t.type}</td>
                  <td>{t.amount}</td>
                  <td>{t.balanceAfter}</td>
                  <td>{t.createdAt}</td>
                  <td>
                    {i === 0 ? (
                      <CgClose className="text-red-500 text-lg" />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const VerifyPasswordModal = ({ setShowBalance }) => {
  const passwordInput = useRef();
  const [errorMsg, setErrorMsg] = useState("");

  const verifyPassword = () => {
    const password = passwordInput.current.value;
    if (DBPassword == password) {
      setShowBalance(true);
      setErrorMsg("");
      passwordInput.current.value = "";
      document.getElementById("verify_password_modal").close();
      toast.success("Login success...");
    } else {
      setErrorMsg("Password not correct ❌");
    }
  };

  return (
    <dialog id="verify_password_modal" className="modal">
      <div className="modal-box flex flex-col gap-3">
        <h3 className="font-bold text-lg">
          <span className="bg-green-600 px-1 py-0.5">Verify</span> Password
        </h3>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 grow">
            <input
              type="text"
              className="input w-full"
              placeholder="Enter your password"
              ref={passwordInput}
            />
            {errorMsg ? <p className="text-sm text-red-500">{errorMsg}</p> : ""}
          </div>
          <button onClick={verifyPassword} className="btn btn-success">
            Verify
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const VerifyPasswordModal2 = ({ setShowBalance, changeAmount }) => {
  const passwordInput = useRef();
  const [errorMsg, setErrorMsg] = useState("");
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const actionType = queryParams.get("actionType");

  const verifyPassword = () => {
    const password = passwordInput.current.value;
    if (DBPassword == password) {
      setShowBalance(true);
      setErrorMsg("");
      passwordInput.current.value = "";
      console.log("Don..");
      document.getElementById("verify_password_modal2").close();
      changeAmount(actionType, true);
    } else {
      setErrorMsg("Password not correct ❌");
    }
  };

  return (
    <dialog id="verify_password_modal2" className="modal">
      <div className="modal-box flex flex-col gap-3">
        <h3 className="font-bold text-lg">
          <span className="bg-green-600 px-1 py-0.5">Verify</span> Password
        </h3>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 grow">
            <input
              type="text"
              className="input w-full"
              placeholder="Enter your password"
              ref={passwordInput}
            />
            {errorMsg ? <p className="text-sm text-red-500">{errorMsg}</p> : ""}
          </div>
          <button onClick={verifyPassword} className="btn btn-success">
            Verify
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default App;
