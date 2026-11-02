const nameFor = (id) => ({ 1: "Amina", 2: "Brian" }[id] || "Unknown");

function getUserCb(userId, cb) {
  setTimeout(() => {
    if (!userId) return cb(new Error("Missing userId"));
    cb(null, { id: userId, name: nameFor(userId) });
  }, 400);
}
function getOrdersCb(user, cb) {
  setTimeout(() => {
    cb(null, [{ id: 101, amount: 20 }, { id: 102, amount: 35 }]);
  }, 400);
}
function getOrderTotalCb(orders, cb) {
  setTimeout(() => {
    const total = orders.reduce((sum, o) => sum + o.amount, 0);
    cb(null, total);
  }, 400);
}
getUserCb(1, (err, user) => {
  if (err) return console.error("A error:", err.message);
  getOrdersCb(user, (err, orders) => {
    if (err) return console.error("A error:", err.message);
    getOrderTotalCb(orders, (err, total) => {
      if (err) return console.error("A error:", err.message);
      console.log(`A: ${user.name} spent ${total}`);
    });
  });
});

function getUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userId) return reject(new Error("Missing userId"));
      resolve({ id: userId, name: nameFor(userId) });
    }, 400);
  });
}
function getOrders(user) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 101, amount: 20 }, { id: 102, amount: 35 }]);
    }, 400);
  });
}
function getOrderTotal(orders) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(orders.reduce((sum, o) => sum + o.amount, 0));
    }, 400);
  });
}

let currentUser;
getUser(1)
  .then((user) => { currentUser = user; return getOrders(user); })
  .then((orders) => getOrderTotal(orders))
  .then((total) => console.log(`B: ${currentUser.name} spent ${total}`))
  .catch((err) => console.error("B error:", err.message));

async function checkout(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user);
    const total = await getOrderTotal(orders);
    console.log(`C: ${user.name} spent ${total}`);
  } catch (err) {
    console.error("C error:", err.message);
  }
}
checkout(1);

async function runBonus() {
  try {
    const [user1, user2] = await Promise.all([getUser(1), getUser(2)]);
    console.log(`Bonus: ${user1.name} and ${user2.name} fetched in parallel`);
  } catch (err) {
    console.error("Bonus error:", err.message);
  }
}
runBonus();
