import React, { useState } from 'react';
import Giscus from "@giscus/react";
import { getStoredItem } from "../../functions/services";
import { useTranslation } from "react-i18next";

const Comments = ({ name }) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        author: 'User',
        date: new Date(),
        content: newComment
      }]);
      setNewComment('');
    }
  };

  if (name && localStorage.getItem("acceptscookies")) {
    const language = getStoredItem("i18nextLng");
    return (
      <div className="w-full p-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-3 bg-gray-900 border-b border-gray-700 text-neutral-300">{t("Comments")}</div>
          <div className="p-4">
            <Giscus
              id="comments"
              repo="dm94/stiletto-web"
              repoId="MDEwOlJlcG9zaXRvcnkyOTk5OTE5OTk="
              category="Comments"
              categoryId="DIC_kwDOEeGDv84CSWZY"
              mapping="specific"
              term={name}
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="top"
              theme={"dark"}
              lang={language}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-900 border-b border-gray-700">{t("Comments")}</div>
        <div className="p-4">
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-gray-300 font-medium">{comment.author}</div>
                  <div className="text-gray-400 text-sm">{new Date(comment.date).toLocaleDateString()}</div>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap">{comment.content}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder={t("Write a comment...")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSubmit}
            >
              {t("Submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
