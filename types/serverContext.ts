import {
  GetServerSidePropsContext,
  GetStaticPathsContext,
  GetStaticPropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

export type ApiContext = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export type SSRContext = GetServerSidePropsContext;
export type ISRContext = GetStaticPropsContext;
export type ISPContext = GetStaticPathsContext;
export type ServerApiContext = ApiContext | SSRContext;
export type Context = SSRContext | ApiContext | ISRContext | ISPContext;
