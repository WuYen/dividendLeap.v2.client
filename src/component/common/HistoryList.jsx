export function HistoryList(props) {
  const { data } = props;
  return (
    <>
      <div>HistoryList</div>
      {data.map((post) => {
        return <div key={`${post.id}${post.batchNo}`}>{post.title}</div>;
      })}
    </>
  );
}
