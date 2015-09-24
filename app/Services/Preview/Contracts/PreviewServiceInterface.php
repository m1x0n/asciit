<?php

namespace App\Services\Preview\Contracts;

interface PreviewServiceInterface
{
    /**
     * @param $url string
     * @return string url for image
     */
    public function get($url);
}

?>