import { useEffect, useState } from "react";
import ApiService from "../services/ApiService.ts";
import { Card } from "primereact/card";

import { DataView } from "primereact/dataview";


import { Divider } from "primereact/divider";

type User = {
  username: string;
  email: string;
};

const ExercicioList = () => {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = async () => {
    const response = (await ApiService.get("/exercicio")) as User[]
    setUsers(response)
  };

  useEffect(() => {
    getUsers();
  }, []);

  const listTemplate = () => {
    // if (!reviews || reviews.length === 0) return null;
    //
    const list = users.map((user) => {
      return <div className="col-12">{user.username}, {user.email}</div>;
    });

    return (
        <div>
          <Divider />
          <div className="grid grid-nogutter">
            {list}
          </div>
        </div>
    );
  };

  return (
    <>
      <h1 className="mb-0 pb-0">Users</h1>
      <Card>
        <DataView value={users} listTemplate={listTemplate} />
      </Card>
    </>
  );
};

export default ExercicioList;
