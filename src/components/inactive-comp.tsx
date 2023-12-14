import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";

const InactiveComp = () => {
  const {
    query: { seq },
  } = useRouter();
  const { data: resData, refetch } = useInactiveTartgetQuery(seq);
  const data = resData?.seq;
  return (
    <>
      <h1>hi Ill die {`${data}`}</h1>
      <button onClick={() => refetch()}>refetch</button>
    </>
  );
};

const useInactiveTartgetQuery = (seq: string | string[] | undefined) => {
  const path = `http://localhost:3004/api/product/${seq}`;

  // return useQuery(["get-inactive", seq], async () => {
  return useQuery(["get-inactive"], async () => {
    return (await axios.get(path)).data;
  });
};

export default InactiveComp;
