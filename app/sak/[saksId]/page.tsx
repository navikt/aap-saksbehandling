const Page = async ({ params }: { params: { saksId: string } }) => {
  return <div>Sakspage {params.saksId}</div>;
};

export default Page;
