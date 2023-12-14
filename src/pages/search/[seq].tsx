import InactiveComp from "@/components/inactive-comp";
import {
  QueryClient,
  dehydrate,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const getQueryKey = (seq: any) => ["search", seq];
// const getQueryKey = (seq: any) => ["search"];

// const isActiveInactiveComp = true;
const isActiveInactiveComp = false;

const ProductPage = () => {
  const {
    push,
    query: { seq },
  } = useRouter();
  const [isInactive, setIsInactive] = useState(!isActiveInactiveComp);

  const { data: resData } = useProduct(seq);
  const data = resData.seq;
  const queryClient = useQueryClient();
  return (
    <div>
      <div>product page</div>
      <button
        onClick={() => {
          queryClient.invalidateQueries(getQueryKey(seq));
        }}
      >
        invalidate
      </button>
      <button
        onClick={() => {
          queryClient.refetchQueries(getQueryKey(seq));
        }}
      >
        refetch
      </button>
      <button
        onClick={() => {
          queryClient.setQueryData(getQueryKey(seq), () => ({
            seq:
              Number(
                (queryClient.getQueryData(getQueryKey(seq)) as { seq: number })
                  .seq
              ) + 2,
          }));
        }}
      >
        setQueryData (+2)
      </button>
      <button
        onClick={() =>
          push({
            pathname: `/search/${Number(seq) - 1}`,
          })
        }
      >
        {Number(seq) - 1}
      </button>
      <button
        onClick={() =>
          push({
            pathname: `/search/${Number(seq)}`,
          })
        }
      >
        {Number(seq)}
      </button>
      <button
        onClick={() =>
          push({
            pathname: `/search/${Number(seq) + 1}`,
          })
        }
      >
        {Number(seq) + 1}
      </button>
      <Link href={`/product/${seq}`}>product</Link>
      <div>{data}</div>
      <button onClick={() => setIsInactive((prev) => !prev)}>
        {!isInactive ? "inactive!" : "active!"}
      </button>
      {!isInactive && <InactiveComp />}
    </div>
  );
};

const getProduct = async (seq: string | string[] | undefined | number) => {
  const path = `/api/product/${seq}`;
  return (await axios.get(`http://localhost:3004${path}`)).data;
};

const useProduct = (seq: string | string[] | undefined) => {
  const query = useQuery(getQueryKey(seq), () => getProduct(seq));
  return query;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const seq = params?.seq;
  const qc = new QueryClient();

  await qc.prefetchQuery(getQueryKey(seq), () => getProduct(seq));
  // await qc.prefetchQuery(["get-inactive", seq], () =>
  await qc.prefetchQuery(["get-inactive"], () =>
    getProduct(Math.floor(Math.random() * 100))
  );

  const dehydratedState = dehydrate(qc);
  return {
    props: {
      dehydratedState,
    },
  };
};

export default ProductPage;
