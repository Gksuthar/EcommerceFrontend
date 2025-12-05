import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from '../../App';
import { IoTimeOutline, IoArrowBack } from 'react-icons/io5';
import { Spinner } from 'react-bootstrap';

const BlogDetail = () => {
  const { slug } = useParams();
  const context = useContext(MyContext);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${context.AppUrl}/api/blog/${slug}`);
        if (response.status === 200 && response.data.data) {
          setBlog(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Blog not found');
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchBlog();
    }
  }, [slug, context.AppUrl]);

  if (loading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">{error || 'Blog not found'}</h2>
        <Link to="/" className="text-primary underline">
          Go back to home
        </Link>
      </div>
    );
  }

  const date = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  return (
    <div className="blogDetailPage bg-white py-10">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <IoArrowBack /> Back to Home
        </Link>

        {/* Blog Image */}
        {blog.catImg && (
          <div className="blogImage mb-6 rounded-lg overflow-hidden">
            <img 
              src={blog.catImg} 
              alt={blog.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Blog Meta */}
        <div className="blogMeta flex items-center gap-4 mb-4 text-gray-600">
          <span className="flex items-center gap-1">
            <IoTimeOutline className="text-lg" />
            {date}
          </span>
          {blog.category && (
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {blog.category}
            </span>
          )}
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {blog.title}
        </h1>

        {/* Blog Description/Content */}
        <div className="blogContent prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {blog.description}
          </p>
          
          {blog.content && (
            <div className="mt-6 text-gray-700 leading-relaxed">
              {blog.content}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="blogFooter mt-10 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            <strong>Author:</strong> {blog.author || 'Admin'}
          </p>
        </div>

        {/* Back to Top */}
        <div className="mt-10 text-center">
          <Link 
            to="/" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
