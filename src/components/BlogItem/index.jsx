import React from "react";
import { IoTimeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const BlogItem = ({ post }) => {
  const image = post?.catImg;
  const date = post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : "05 February, 2025";
  console.log("Blog Item Rendered:", post);
  return (
    <div className="blofItem group cursor-pointer">
      <div className="imgWrapper w-full overflow-hidden rounded-md relative">
        <img
          src={image}
          alt={post?.title || "blogImage"}
          className="w-full h-[160px] object-cover transition-all duration-300 group-hover:scale-105 "
        />
        <span className="flex items-center justify-center text-white absolute bottom-[15px] right-[15px] z-50 bg-primary p-1 rounded-md gap-1 text-[14px] font-[500]">
          <IoTimeOutline className="text-[14px] font-bold" />
          {date}
        </span>
      </div>

      <div className="info py-4">
        <h2 className="text-[16px] font-[500] text-black">
          <Link to={`/blog/${post?.slug}`}>{post?.title}</Link>
        </h2>
        <p className="text-[12px] font-[500] text-[rgba(0,0,0,0.8)] mb-4">
          {post?.description?.substring(0, 120)}
        </p>
        <Link className="link font-[500] text-[14px] underline" to={`/blog/${post?.slug}`}>
          ReadMore
        </Link>
      </div>
    </div>
  );
};

export default BlogItem;
