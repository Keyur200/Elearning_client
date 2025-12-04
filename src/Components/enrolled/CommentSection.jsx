import React, { useState, useEffect } from "react";
import { User, Send, MessageSquare, CornerDownRight } from "lucide-react";
import { addVideoReview, replyToReview } from "../../api/enrollmentApi";

const CommentSection = ({ videoId, user, reviews = [], isInstructor }) => {
  const [comments, setComments] = useState(reviews);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState({});
  const [replyLoading, setReplyLoading] = useState(null);

  useEffect(() => setComments(reviews), [reviews]);

  // ----------------------------------------
  // Add new comment
  // ----------------------------------------
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

  // ----------------------------------------
  // Instructor reply
  // ----------------------------------------
  const handleReply = async (reviewId) => {
    if (!replyText[reviewId]?.trim()) return;
    setReplyLoading(reviewId);

    try {
      const data = await replyToReview(reviewId, replyText[reviewId]);
      setComments((prev) =>
        prev.map((c) =>
          c._id === reviewId
            ? { ...c, reply: data.review.reply, resolved: true }
            : c
        )
      );
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to post reply");
    } finally {
      setReplyLoading(null);
    }
  };

  // ----------------------------------------
  // Render avatar (handles all cases)
  // ----------------------------------------
  const renderAvatar = (commentUser, size = 10) => {
    if (!commentUser) {
      return <User size={size * 2} className="text-slate-500" />;
    }

    const initials = commentUser.name?.charAt(0).toUpperCase() || "U";

    if (commentUser.profileImage) {
      return (
        <img
          src={commentUser.profileImage}
          alt={commentUser.name || "User"}
          className="w-full h-full object-cover"
        />
      );
    }

    return (
      <div
        className={`w-${size} h-${size} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="mt-8 max-w-4xl">
      {/* Header */}
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
        <MessageSquare size={20} /> Discussion{" "}
        <span className="text-slate-400 text-sm font-normal">
          ({comments.length})
        </span>
      </h3>

      {/* Add Comment */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-full">
            {renderAvatar(user, 10)}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
              className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Have a question? Ask it here..."
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-full text-sm flex items-center gap-2"
              >
                {loading ? "Posting..." : <><Send size={14} /> Post Comment</>}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-slate-400 italic">
              No discussions yet. Be the first to start one!
            </p>
          </div>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="flex flex-col gap-3">
              {/* Main Comment */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  {renderAvatar(c.user)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-800 text-sm">
                      {c.user?.name || "User"}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-700 text-sm bg-white p-2 rounded-md">
                    {c.comment}
                  </div>
                </div>
              </div>

              {/* Instructor Reply */}
              {c.reply && (
                <div className="ml-14 flex gap-3">
                  <CornerDownRight size={18} className="text-indigo-500" />
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 w-full">
                    <p className="text-sm font-semibold text-indigo-700">
                      Instructor Reply
                    </p>
                    <p className="text-sm text-indigo-800 mt-1">{c.reply}</p>
                  </div>
                </div>
              )}

              {/* Instructor Reply Input */}
              {isInstructor && !c.reply && (
                <div className="ml-14">
                  <textarea
                    rows={1}
                    className="w-full p-3 bg-white border text-sm border-slate-300 rounded-lg"
                    placeholder="Reply to this student..."
                    value={replyText[c._id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [c._id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => handleReply(c._id)}
                    disabled={!replyText[c._id] || replyLoading === c._id}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-1 rounded-full"
                  >
                    {replyLoading === c._id ? "Sending..." : "Reply"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
