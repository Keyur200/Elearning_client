import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Send,
  Loader,
  User,
  Film
} from 'lucide-react';
import Swal from 'sweetalert2';

const FAQ = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({}); // Stores reply text for each review ID
  const [activeReplyId, setActiveReplyId] = useState(null); // Controls which reply box is open
  const [filter, setFilter] = useState('all'); // 'all', 'unresolved', 'resolved'

  useEffect(() => {
    fetchReviews();
  }, []);

  // 🟢 1. Fetch all reviews for this instructor
  const fetchReviews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/instructor/reviews", {
        withCredentials: true
      });
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 2. Handle Reply Submission using your provided API
  const handleReplySubmit = async (reviewId) => {
    const reply = replyText[reviewId];
    if (!reply || reply.trim() === "") return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/review/${reviewId}/reply`,
        { reply },
        { withCredentials: true }
      );

      // The API returns the raw review object. 
      // We must merge it with existing state to keep student/course info visible.
      if (res.data.review) {
        setReviews((prev) => 
          prev.map((r) => 
            r._id === reviewId 
              ? { ...r, reply: res.data.review.reply, resolved: true } 
              : r
          )
        );
        
        setActiveReplyId(null);
        setReplyText((prev) => ({ ...prev, [reviewId]: "" })); // Clear input
        Swal.fire("Success", "Reply added & student notified", "success");
      }

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to send reply.", "error");
    }
  };

  // Filter Logic
  const filteredReviews = reviews.filter(r => {
    if (filter === 'unresolved') return !r.resolved;
    if (filter === 'resolved') return r.resolved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="flex flex-col items-center gap-2">
           <Loader className="animate-spin text-indigo-600" size={40} />
           <p className="text-gray-500 font-medium">Loading Q&A...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-50 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Q&A</h1>
            <p className="text-gray-500 mt-1">Manage and reply to comments on your course videos.</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
            {['all', 'unresolved', 'resolved'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
              <p className="text-gray-500">
                {filter === 'all' ? "You don't have any student questions yet." : `No ${filter} questions found.`}
              </p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review._id} 
                className={`bg-white rounded-xl border p-6 transition-all duration-200 ${
                  !review.resolved 
                    ? 'border-indigo-100 shadow-md ring-1 ring-indigo-50' 
                    : 'border-gray-200 shadow-sm'
                }`}
              >
                {/* 1. Review Header Info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
                      {review.student?.name?.charAt(0) || <User size={18}/>}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {review.student?.name || "Unknown Student"}
                      </h4>
                      
                      {/* Course Context */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium truncate max-w-[150px]">
                            {review.course?.title || "Unknown Course"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1 text-gray-500">
                            <Film size={10} />
                            {review.video?.title || "Unknown Video"}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    review.resolved 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {review.resolved ? <CheckCircle size={12}/> : <Clock size={12}/>}
                    {review.resolved ? 'Replied' : 'Pending'}
                  </span>
                </div>

                {/* 2. Student Comment */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-gray-800 text-sm leading-relaxed border border-gray-100">
                  "{review.comment}"
                </div>

                {/* 3. Instructor Reply Section */}
                {review.reply ? (
                  // Existing Reply Display
                  <div className="ml-4 md:ml-12 mt-4 relative">
                    <div className="absolute -left-6 top-3 w-4 h-4 border-l-2 border-b-2 border-gray-200 rounded-bl-lg"></div>
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                        <p className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1">
                            <CheckCircle size={12} /> You Replied:
                        </p>
                        <p className="text-sm text-gray-700">{review.reply}</p>
                    </div>
                  </div>
                ) : (
                  // Reply Input Form
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {activeReplyId === review._id ? (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <textarea
                          rows="3"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm outline-none resize-none bg-white"
                          placeholder="Type your helpful response here..."
                          value={replyText[review._id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                          autoFocus
                        ></textarea>
                        
                        <div className="flex justify-end gap-3 mt-3">
                          <button 
                            onClick={() => setActiveReplyId(null)}
                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleReplySubmit(review._id)}
                            className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                          >
                            <Send size={16} /> Post Reply
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setActiveReplyId(review._id)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-2 rounded-lg transition flex items-center gap-2 -ml-2"
                      >
                        <MessageCircle size={18} />
                        Reply to this question
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;