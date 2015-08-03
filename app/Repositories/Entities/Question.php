<?php

namespace App\Repositories\Entities;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

class Question extends Model implements Transformable
{
    use TransformableTrait;

    protected $table = 'q_and_a';

    protected $fillable = ['title', 'description'];

    public function user()
    {
        return $this->belongsTo('App\Repositories\Entities\User');
    }

    public function folder()
    {
        return $this->belongsTo('App\Repositories\Entities\Folder');
    }
}