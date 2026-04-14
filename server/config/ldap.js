import ldap from "ldapjs";

export const authenticateWithLDAP = (username, password) => {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: process.env.LDAP_URL,
    });

    client.on("error", (err) => {
      reject(new Error("LDAP connection failed: " + err.message));
    });

    // Bind as admin
    client.bind(
      process.env.LDAP_BIND_DN,
      process.env.LDAP_BIND_PASSWORD,
      (err) => {
        if (err) {
          client.destroy();
          return reject(new Error("LDAP admin bind failed"));
        }

        const searchOptions = {
          filter: `(uid=${username})`,
          scope: "sub",
          attributes: ["dn", "cn", "mail", "uid"],
        };

        // Search inside ou=Users specifically
        client.search(
          `ou=Users,${process.env.LDAP_BASE_DN}`, // 👈 search inside Users folder
          searchOptions,
          (err, searchRes) => {
            if (err) {
              client.destroy();
              return reject(new Error("LDAP search failed"));
            }

            let userDN = null;
            let userInfo = {};

            searchRes.on("searchEntry", (entry) => {
              userDN = entry.dn.toString();
              entry.pojo.attributes.forEach((attr) => {
                userInfo[attr.type] = attr.values[0];
              });
            });

            searchRes.on("end", () => {
              if (!userDN) {
                client.destroy();
                return reject(new Error("User not found in LDAP"));
              }

              // Verify password by binding as user
              client.bind(userDN, password, (err) => {
                client.destroy();
                if (err) {
                  return reject(new Error("Invalid LDAP credentials"));
                }
                resolve(userInfo);
              });
            });

            searchRes.on("error", (err) => {
              client.destroy();
              reject(new Error("LDAP search error: " + err.message));
            });
          },
        );
      },
    );
  });
};
