import React, { useState } from "react";
import { User, Send, MessageSquare } from "lucide-react";
import { addVideoReview } from "../../api/enrollmentApi";

const CommentSection = ({ videoId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const data = await addVideoReview(videoId, newComment);
      setComments([data.review, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 max-w-4xl">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
        <MessageSquare size={20} />
        Discussion <span className="text-slate-400 text-sm font-normal">({comments.length})</span>
      </h3>

      {/* Input Form */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              placeholder="Have a question? Ask it here..."
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading || !newComment}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
              >
                {loading ? "Posting..." : <><Send size={14} /> Post Comment</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-slate-400 italic">No discussions yet. Be the first to start one!</p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex gap-4 group">
               <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {c.avatar ? (
                  <img src={c.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User className="text-slate-500" size={20} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-sm">{c.user || "User"}</span>
                  <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-slate-700 text-sm leading-relaxed bg-white/50">
                  {c.comment}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;