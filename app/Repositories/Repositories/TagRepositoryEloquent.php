<?php

namespace App\Repositories\Repositories;

use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\Entities\Tag;
use App\Repositories\Contracts\TagRepository;

/**
 * Class TagRepositoryEloquent
 * @package namespace App\RepositoriesRepositories;
 */
class TagRepositoryEloquent extends Repository implements TagRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Tag::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}