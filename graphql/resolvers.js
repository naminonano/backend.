const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Location = require("../models/location");
const Duration = require("../models/duration");
const {
  ValuesOfCorrectType,
} = require("graphql/validation/rules/ValuesOfCorrectType");
const user = require("../models/user");
const findsim = (a, b) => {
  const dot = (v1, v2) =>
    v1.map((x, i) => v1[i] * v2[i]).reduce((m, n) => m + n);
  const mag = (v) => {
    let m = 0;
    v.map((i) => {
      m += i ** 2;
    });

    return Math.sqrt(m);
  };
  return dot(a, b) / (mag(a) * mag(b));
};
function sort_object(obj) {
  items = Object.keys(obj).map(function (key) {
    return [key, obj[key]];
  });
  items.sort(function (first, second) {
    return second[1] - first[1];
  });
  sorted_obj = {};
  $.each(items, function (k, v) {
    use_key = v[0];
    use_value = v[1];
    sorted_obj[use_key] = use_value;
  });
  return sorted_obj;
}
const createuservector = (l) => {
  console.log(l.length);
  v = [];
  for (let i = 0; i < 1200; i++) {
    let a = 0;
    // l = l.map((i) => JSON.parse(i));
    l.map((j) => {
      a += j[i];
    });
    a = a / l.length;

    v.push(a);
  }
  console.log(v);

  return v;
};

const getvector = async (locations) => {
  const v = [];

  for (let i in locations) {
    let a = await Location.findOne({ name: locations[i] });
    a = JSON.parse(a["_doc"]["vector"]);
    v.push(a);
  }
  return v;
};

module.exports = {
  getinfo: async function ({ selected }, req) {
    let p = [];
    for (let i in selected) {
      a = await Location.findOne({ name: selected[i] });
      p.push(a);
    }

    return p;
  },
  getduration: async function ({ selected }, req) {
    let dis = [];
    for (let i in selected) {
      s = [...selected];
      s.splice(i, 1);
      // console.log(s);
      for (let j in s) {
        a = await Duration.findOne({ from: selected[i], to: s[j] });
        dis.push(a);
      }
    }

    return dis;
  },
  getallinfo: async function (arg, req) {
    a = await Location.find();
    return a.map((i) => i["_doc"]);
  },
  getsim: async function ({ email }) {
    let v1 = await User.findOne({ email: email });
    locations = v1["locations"];
    v1 = v1["vector"];
    a = await Location.find();
    let dict = {};
    a.map((i) => {
      if (!locations.includes(i["_doc"]["name"])) {
        v2 = JSON.parse(i["_doc"]["vector"]);
        info = i["_doc"];
        delete info["vector"];
        dict[i["_doc"]["name"]] = { score: findsim(v1, v2), info: info };
      }
    });
    var items = Object.keys(dict).map(function (key) {
      return [key, dict[key]["score"], dict[key]["info"]];
    });

    const isnone = (d) => {
      d = d[2];

      if (
        d["open0"] ||
        d["open1"] ||
        d["open2"] ||
        d["open3"] ||
        d["open4"] ||
        d["open5"] ||
        d["open6"]
      ) {
        return false;
      }
      return true;
    };
    for (let i in items) {
      isnone(items[i]);
    }
    items = items.filter((i) => !isnone(i));
    items.sort(function (first, second) {
      return second[1] - first[1];
    });

    items = items.slice(0, 30);
    r = {};
    items = items.map((i, j) => i[2]);
    console.log(items);
    return items;
  },
  createuser: async function ({ email, password }, req) {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      locations: [],
      vector: [],
      password: hashedPw,
    });
    const a = await user.save();
    return 10;
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "test",
      { expiresIn: "1h" }
    );

    return { token: token, userId: user._id.toString() };
  },
  // addfav: async function ({ name, email }) {
  //   let user = await User.findOne({ email: email });
  //   let locations = user["locations"];
  //   console.log(locations, "bf");
  //   locations.push(name);
  //   let vectorarray = await getvector(locations);

  //   user.locations = locations;
  //   user.vector = createuservector(vectorarray);
  //   await user.save();
  //   console.log(locations, "af");
  //   return "done";
  //   return locations;
  // },
  // removefav: async function ({ name, email }) {
  //   let user = await User.findOne({ email: email });
  //   let locations = user["locations"];
  //   console.log(lotions, "bf");
  //   locations = locations.filter((i) => i !== name);
  //   let vectorarray = await getvector(locations);
  //   user.locations = locations;
  //   console.log(locations, "af");
  //   user.vector = createuservector(vectorarray);
  //   console.log(user.locations, "user");

  //   await user.save();
  //   return "done";
  //   return { locations: locations };
  // },
  getuserinfo: async function ({ email }) {
    let user = await User.findOne({ email: email });

    return user;
  },
  updatefav: async function ({ favorite, email }) {
    let user = await User.findOne({ email: email });
    let vector;
    if (favorite.length > 0) {
      console.log("run");
      let vectorarray = await getvector(favorite);
      user.vector = createuservector(vectorarray);
    } else {
      user.vector = null;
    }

    user.locations = favorite;

    await user.save();

    return "done";
    return { locations: locations };
  },
};
