<?php

namespace App\Http\Resources;

use App\Models\Post;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedResource extends JsonResource
{
  /**
   * The "data" wrapper that should be applied.
   *
   * @var string|null
   */
  public static $wrap = null;

  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
   */
  public function toArray($request)
  {
    $photo = $this->getFirstMedia(Post::$photoMediaCollectionName);

    return [
      "id" => $this->id,
      "content" => $this->content,
      "photo" => new FeedPhotoResource($this->when($photo !== null, $photo)),
      "writer" => new FeedWriterResource($this->whenLoaded("writer")),
      "created_at" => $this->created_at,
      "updated_at" => $this->updated_at,
    ];
  }
}
