export function MyPostList(props) {
  const { data } = props;
  return (
    <>
      <div>MyPostList</div>
      {data.map((post) => {
        return <div key={`${post.id}${post.batchNo}`}>{post.title}</div>;
      })}
    </>
  );
}
