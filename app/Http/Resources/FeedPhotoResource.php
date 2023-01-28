<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\Support\ImageFactory;

class FeedPhotoResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
   */
  public function toArray($request)
  {
    $originalUrl = $this->getFullUrl();
    $thumbUrl = $this->getFullUrl("thumb");

    return [
      "url" => $originalUrl,
      "dimension" => $this->getDimension($thumbUrl),
      "thumb" => [
        "url" => $this->hasGeneratedConversion("thumb")
          ? $thumbUrl
          : $originalUrl,
        "dimension" => $this->getDimension($thumbUrl)
      ]
    ];
  }

  private function getDimension(string $path)
  {
    $img = ImageFactory::load($path);
    return [
      "width" => $img->getWidth(),
      "height" => $img->getHeight()
    ];
  }
}
