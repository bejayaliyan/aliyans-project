
export const FETCH_USER_LOGIN = 'FETCH_USER_LOGIN';
export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_DRIVERS = 'FETCH_DRIVERS';
export const FETCH_PAGES = 'FETCH_PAGES';
export const FETCH_FIELDS = 'FETCH_FIELDS';
export const FETCH_VALUES = 'FETCH_VALUES';
export const FETCH_SERVICES = 'FETCH_SERVICES';
export const FETCH_TESTIMONIALS = 'TESTIMONIALS';
export const FETCH_BLOGS = 'BLOGS';
export const FETCH_COMMENTS = 'COMMENTS';
export const FETCH_CATEGORIES = 'CATEGORIES';
export const FETCH_HOME_SERVICES = 'FETCH_HOME_SERVICES';
export const FETCH_REDIRECTS = 'FETCH_REDIRECTS';
export const FETCH_TAGS = 'FETCH_TAGS';
export const FETCH_SEOS = 'FETCH_SEOS';

export function fetchUserLogin(status) {
    return {
        type: FETCH_USER_LOGIN,
        payload: status
    }
};
export function fetchUsets(users){
    return{
        type:FETCH_USERS,
        payload:users
    }
}
export function fetchdrivers(drivers){
    return{
        type:FETCH_DRIVERS,
        payload:drivers
    }
}

export function fetchPages(pages){
    return{
        type:FETCH_PAGES,
        payload:pages
    }
}

export function fetchFields(fields){
    return{
        type:FETCH_FIELDS,
        payload:fields
    }
}

export function fetchValues(values){
    return{
        type:FETCH_VALUES,
        payload:values
    }
}

export function fetchServices(services){
    return{
        type:FETCH_SERVICES,
        payload:services
    }
}

export function fetchHomeServices(homeServices){
    return{
        type:FETCH_HOME_SERVICES,
        payload:homeServices
    }
}

export function fetchTestimonials(testimonials){
    return{
        type:FETCH_TESTIMONIALS,
        payload:testimonials
    }
}

export function fetchBlogs(blogs){
    return{
        type:FETCH_BLOGS,
        payload:blogs
    }
}

export function fetchComments(comments){
    return{
        type:FETCH_COMMENTS,
        payload:comments
    }
}

export function fetchCategories(categories){
    return{
        type:FETCH_CATEGORIES,
        payload:categories
    }
}

export function fetchRedirects(redirects){
    return{
        type:FETCH_REDIRECTS,
        payload:redirects
    }
}

export function fetchTags(tags){
    return{
        type:FETCH_TAGS,
        payload:tags
    }
}

export function fetchSeos(soes){
    return{
        type:FETCH_SEOS,
        payload:soes
    }
}