import FileInput from "@/Components/FileInput";
import InputError from "@/Components/InputError";
import Post from "@/Components/Post";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/inertia-react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function Index({ auth, posts }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    content: "",
    photo: null,
  });

  const [showLbox, setShowLbox] = useState(false);
  const [lboxSources, setLboxSources] = useState([]);

  const submit = (e) => {
    e.preventDefault();
    post(route("posts.store"), {
      onSuccess: () => reset(),
      forceFormData: true,
    });
  };

  return (
    <AuthenticatedLayout auth={auth}>
      <Head title="Posts" />

      <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <form onSubmit={submit}>
          <textarea
            value={data.content}
            placeholder="What's on your mind?"
            className="block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm"
            onChange={(e) => setData("content", e.target.value)}
          ></textarea>
          <FileInput
            value={data.photo}
            className="mt-2"
            handleChange={(f) => setData("photo", f)}
          />
          <InputError message={errors.content} className="mt-2" />
          <PrimaryButton className="mt-4" processing={processing}>
            Post
          </PrimaryButton>
        </form>

        <div className="mt-6 bg-white shadow-sm rounded-lg divide-y">
          {posts.data.map((post) => (
            <Post
              key={post.id}
              post={post}
              onPhotoClick={(url) => {
                setLboxSources([{ src: url }]);
                setShowLbox(true);
              }}
            />
          ))}
        </div>
      </div>

      <Lightbox
        open={showLbox}
        close={() => setShowLbox(false)}
        slides={lboxSources}
        render={{
          buttonNext: () => null,
          buttonPrev: () => null,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </AuthenticatedLayout>
  );
}
