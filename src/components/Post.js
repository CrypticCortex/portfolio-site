const Post = ({ title, description, imgSrc }) => {
  return (
    <article className="grid gap-4 md:gap-6">
      <img
        src={imgSrc}
        width={800}
        height={400}
        alt="Blog post image"
        className="rounded-lg object-cover aspect-[2/1]"
      />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </article>
  );
};

export default Post;