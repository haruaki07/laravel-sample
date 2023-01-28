<?php

namespace App\Http\Controllers;

use App\Http\Resources\FeedResource;
use App\Http\Resources\PostCollection;
use App\Models\Post;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $posts = Post::with([
      "writer",
      "media"
    ])->latest("created_at")->get();

    return Inertia::render("Posts/Index")
      ->with("posts", FeedResource::collection($posts));
  }

  /**
   * Show the form for creating a new resource.
   *
   * @return \Illuminate\Http\Response
   */
  public function create()
  {
    //
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $data = $request->validate([
      'content' => 'required|string|max:350',
      "photo" => 'nullable|image'
    ]);

    /** @var Post */
    $post = $request->user()->posts()->create($data);

    if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
      $post
        ->addMediaFromRequest('photo')
        ->toMediaCollection(Post::$photoMediaCollectionName);
    }

    return redirect(route('posts.index'));
  }

  /**
   * Display the specified resource.
   *
   * @param  \App\Models\Post  $post
   * @return \Illuminate\Http\Response
   */
  public function show(Post $post)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param  \App\Models\Post  $post
   * @return \Illuminate\Http\Response
   */
  public function edit(Post $post)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \App\Models\Post  $post
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Post $post)
  {
    $this->authorize('update', $post);

    $data = $request->validate([
      'content' => 'required|string|max:350',
    ]);

    $post->update($data);

    return redirect(route('posts.index'));
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  \App\Models\Post  $post
   * @return \Illuminate\Http\Response
   */
  public function destroy(Post $post)
  {
    $this->authorize("delete", $post);

    $post->delete();

    return redirect(route("posts.index"));
  }
}
