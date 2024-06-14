export function PostList(props) {
  const { data } = props;
  return (
    <>
      <div>post list</div>
      {data.map((post) => {
        return <div key={`${post.id}${post.batchNo}`}>{post.title}</div>;
      })}
    </>
  );
}
