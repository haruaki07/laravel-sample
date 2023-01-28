<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Image\Manipulations;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;


class Post extends Model implements HasMedia
{
  use HasFactory, InteractsWithMedia;

  static $photoMediaCollectionName = "photos";

  protected $fillable = [
    "content",
  ];

  public function registerMediaCollections(): void
  {
    $this
      ->addMediaCollection(Post::$photoMediaCollectionName)
      ->onlyKeepLatest(3);
  }

  public function registerMediaConversions(?Media $media = null): void
  {
    $this->addMediaConversion('thumb')
      ->performOnCollections(Post::$photoMediaCollectionName)
      ->fit(Manipulations::FIT_MAX, 500, 500)
      ->nonOptimized();
  }

  public function writer()
  {
    return $this->belongsTo(User::class, "user_id");
  }
}
