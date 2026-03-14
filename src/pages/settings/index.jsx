import { useState } from "react";

const CURRENCIES = [
  {
    code: "UZS",
    name: "Uzbek Som",
    flag: "https://flagcdn.com/w40/uz.png",
    symbol: "UZS",
  },
  {
    code: "USD",
    name: "US Dollar",
    flag: "https://flagcdn.com/w40/us.png",
    symbol: "$",
  },
  {
    code: "EUR",
    name: "Euro",
    flag: "https://flagcdn.com/w40/eu.png",
    symbol: "€",
  },
  {
    code: "RUB",
    name: "Russian Ruble",
    flag: "https://flagcdn.com/w40/ru.png",
    symbol: "₽",
  },
  {
    code: "GBP",
    name: "British Pound",
    flag: "https://flagcdn.com/w40/gb.png",
    symbol: "£",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    flag: "https://flagcdn.com/w40/cn.png",
    symbol: "¥",
  },
  {
    code: "KZT",
    name: "Kazakh Tenge",
    flag: "https://flagcdn.com/w40/kz.png",
    symbol: "₸",
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    flag: "https://flagcdn.com/w40/tr.png",
    symbol: "₺",
  },
];

const RATES_TO_USD = {
  UZS: 1 / 12130.41,
  USD: 1,
  EUR: 1.08,
  RUB: 0.011,
  GBP: 1.27,
  CNY: 0.138,
  KZT: 0.0022,
  TRY: 0.031,
};

function convert(amount, from, to) {
  if (!amount || isNaN(amount)) return "";
  const inUSD = parseFloat(amount) * RATES_TO_USD[from];
  const result = inUSD / RATES_TO_USD[to];
  return result.toFixed(2);
}

function getRateLabel(from, to) {
  const rate = (1 / RATES_TO_USD[to]) * RATES_TO_USD[from];
  return `1 ${from} = ${(1 / rate).toLocaleString("uz-UZ", { maximumFractionDigits: 2 }).replace(/,/g, " ")} ${to}`;
}

function CurrencyDropdown({ value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const cur = CURRENCIES.find((c) => c.code === value);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 px-2.5 py-1.75 sm:px-.75 sm:py-2 md:px-3 md:py-2.25 border-[1.5px] border-gray-200 rounded-[10px] bg-white cursor-pointer min-w-25 sm:min-w-27.5 md:min-w-30 text-[13px] sm:text-[14px] md:text-[15px]"
      >
        <img src={cur.flag} width={20} />
        <span style={{ fontWeight: 600 }}>{cur.code}</span>
        <span style={{ color: "#9CA3AF", fontSize: 12 }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 20,
            background: "#fff",
            border: "1.5px solid #E5E7EB",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: 180,
            overflow: "hidden",
          }}
        >
          {CURRENCIES.filter((c) => c.code !== exclude).map((c) => (
            <button
              key={c.code}
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 14px",
                border: "none",
                background: c.code === value ? "#EEF2FF" : "#fff",
                cursor: "pointer",
                fontSize: 14,
                textAlign: "left",
                color: c.code === value ? "#4F46E5" : "#374151",
                fontWeight: c.code === value ? 700 : 400,
              }}
            >
              <img src={c.flag} width={20} /> <span>{c.code}</span>
              <span
                style={{ color: "#9CA3AF", fontSize: 12, marginLeft: "auto" }}
              >
                {c.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [show, setShow] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle = () => {
    if (!form.current || !form.newPass || !form.confirm)
      return setError("All fields are required.");
    if (form.newPass.length < 6)
      return setError("New password must be at least 6 characters.");
    if (form.newPass !== form.confirm)
      return setError("Passwords do not match.");
    setError("");
    setSuccess(true);
    setTimeout(onClose, 1200);
  };

  const EyeIcon = ({ visible }) => (
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="#9CA3AF"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {visible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] p-6 sm:p-8 md:p-10 w-full max-w-95 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
        {/* Title */}
        <h3 className="text-[16px] sm:text-[18px] md:text-[20px] font-semibold mb-5 mt-0">
          Change Password
        </h3>

        {/* Password Fields */}
        {["current", "newPass", "confirm"].map((field, i) => (
          <div key={field} className="mb-3">
            <label className="block text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-gray-500 uppercase tracking-[0.8px]">
              {["Current Password", "New Password", "Confirm New Password"][i]}
            </label>
            <div className="relative mt-1">
              <input
                type={show[field] ? "text" : "password"}
                value={form[field]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [field]: e.target.value }))
                }
                placeholder="••••••••"
                className="w-full border-[1.5px] border-gray-200 rounded-[10px]  py-2 px-3 pr-9 md:py-2.25 md:px-3 md:pr-10 text-[13px] sm:text-[14px] md:text-[15px] outline-none box-border"
              />
              <button
                type="button"
                onClick={() => setShow((s) => ({ ...s, [field]: !s[field] }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0"
              >
                <EyeIcon visible={show[field]} />
              </button>
            </div>
          </div>
        ))}

        {/* Error / Success Messages */}
        {error && (
          <p className="text-red-500 text-[12px] sm:text-[13px] mb-3">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 text-[12px] sm:text-[13px] mb-3">
            Password changed successfully!
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.25 sm:py-2.5 rounded-[10px] border-[1.5px] border-gray-200 bg-white font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handle}
            className="flex-1 py-2.25 sm:py-2.5 rounded-[10px] border-none bg-[#1D3557] text-white font-bold cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({ name: "", surname: "" });
  const [saved, setSaved] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  const [avatarColor, setAvatarColor] = useState("#BFDBFE");

  const [fromCur, setFromCur] = useState("UZS");
  const [toCur, setToCur] = useState("USD");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [rateLabel, setRateLabel] = useState("1 USD = 12 130,41 UZS");
  const [converting, setConverting] = useState(false);

  const displayName = [
    profile.name || "Name",
    profile.surname || "Surname",
  ].join(" ");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRefresh = () => {
    setConverting(true);
    setTimeout(() => {
      const res = convert(amount, fromCur, toCur);
      setResult(res);
      setRateLabel(getRateLabel(fromCur, toCur));
      setConverting(false);
    }, 600);
  };

  const handleAmountChange = (val) => {
    setAmount(val);
    setResult(convert(val, fromCur, toCur));
  };

  const avatarColors = [
    "#BFDBFE",
    "#BBF7D0",
    "#FDE68A",
    "#FECACA",
    "#E9D5FF",
    "#99F6E4",
  ];

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #6366F1 !important; outline: none; }
      `}</style>

      <div className="shadow-sm bg-white p-5 border border-[#E0E0E0] rounded-2xl">
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h3 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] text-gray-800 ">
            My Profile
          </h3>
          <button
            onClick={() => setShowPassModal(true)}
            className="bg-[#1D3557] text-white border-none rounded-xl px-5 py-2.5 font-bold text-[14px] cursor-pointer"
          >
            Change Password
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Profile Card */}
          <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-6 sm:p-7 md:p-8">
            {/* Avatar + Info */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div
                className="self-center sm:self-auto"
                style={{ position: "relative" }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 14,
                    background: avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#1D3557",
                  }}
                >
                  {(profile.name?.[0] || "N").toUpperCase()}
                  {(profile.surname?.[0] || "S").toUpperCase()}
                </div>
                <button
                  onClick={() => setEditAvatar((v) => !v)}
                  style={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    background: "#fff",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <svg
                    width="11"
                    height="11"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                {editAvatar && (
                  <div
                    style={{
                      position: "absolute",
                      top: 70,
                      left: 0,
                      background: "#fff",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: 12,
                      padding: 10,
                      zIndex: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: "#9CA3AF",
                        marginBottom: 6,
                        fontWeight: 600,
                      }}
                    >
                      PICK COLOR
                    </p>
                    <div style={{ display: "flex", gap: 6 }}>
                      {avatarColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setAvatarColor(c);
                            setEditAvatar(false);
                          }}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: c,
                            border:
                              c === avatarColor
                                ? "2px solid #1D3557"
                                : "2px solid transparent",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="font-bold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] text-gray-800">
                  {displayName}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 3 }}>
                  <span style={{ fontWeight: 600 }}>Phone Number:</span> +998 94
                  123 12 12
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                  <span style={{ fontWeight: 600 }}>Password:</span> ••••••••
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}
              >
                Name <span style={{ color: "#9CA3AF" }}>(Optional)</span>
              </label>
              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Enter your name"
                className="block w-full mt-1.5 border-[1.5px] border-gray-300 rounded-[10px] py-2 px-3 sm:py-2.25 sm:px-3.25 md:py-2.5 md:px-3.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700"
              />
            </div>

            {/* Surname Field */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}
              >
                Surname <span style={{ color: "#9CA3AF" }}>(Optional)</span>
              </label>
              <input
                value={profile.surname}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, surname: e.target.value }))
                }
                placeholder="Enter your surname"
                className="block w-full mt-1.5 border-[1.5px] border-gray-300 rounded-[10px] py-2 px-3 sm:py-2.25 sm:px-3.25 md:py-2.5 md:px-3.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-[#1D3557] text-white border-none rounded-xl py-2.25 px-5 sm:py-2.5 sm:px-6 md:py-2.75 md:px-7 font-bold text-[12px] sm:text-[13px] md:text-[14px] cursor-pointer transition-colors duration-200"
              >
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Currency Converter */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              padding: 28,
            }}
          >
            <h3 className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px] text-gray-800 mt-0 mb-5">
              Currency Converter
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] sm:text-[11px] md:text-[12px] text-gray-500 font-semibold mb-2">
                  From
                </label>
                <CurrencyDropdown
                  value={fromCur}
                  onChange={(c) => {
                    setFromCur(c);
                    setResult(convert(amount, c, toCur));
                  }}
                  exclude={toCur}
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] md:text-[12px] text-gray-500 font-semibold mb-2">
                  To
                </label>
                <CurrencyDropdown
                  value={toCur}
                  onChange={(c) => {
                    setToCur(c);
                    setResult(convert(amount, fromCur, c));
                  }}
                  exclude={fromCur}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Amount
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full border-[1.5px] border-gray-200 rounded-[10px] py-2 pr-10 pl-3 sm:py-2.25 sm:pr-11.25 sm:pl-3.25 md:py-2.5 md:pr-12.5 md:pl-3.5 text-[13px] sm:text-[14px] md:text-[15px]"
                  placeholder="0.00"
                />
                <span
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    color: "#9CA3AF",
                    fontWeight: 600,
                  }}
                >
                  {fromCur}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  fontSize: 12,
                  color: "#6B7280",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Result
              </label>
              <div style={{ position: "relative" }}>
                <input
                  readOnly
                  value={result}
                  className="w-full border-[1.5px] border-gray-200 rounded-[10px] py-2 pr-10 pl-3 sm:py-2.25 sm:pr-11.25 sm:pl-3.25 md:py-2.5 md:pr-12.5 md:pl-3.5 text-[13px] sm:text-[14px] md:text-[15px]"
                  placeholder="0.00"
                />
                <span
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    color: "#9CA3AF",
                    fontWeight: 600,
                  }}
                >
                  {toCur}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 13, color: "#6B7280" }}>
                {rateLabel}
              </span>
              <button
                onClick={handleRefresh}
                style={{
                  background: "#E11D48",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 24px",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  minWidth: 100,
                }}
              >
                {converting ? "..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPassModal && (
        <ChangePasswordModal onClose={() => setShowPassModal(false)} />
      )}
    </div>
  );
}
