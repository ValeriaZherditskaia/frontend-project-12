// API-функции для каналов

import axios from './axiosConfig.js'

export const channelsApi = {
  getAll: () => axios.get('/channels').then(res => res.data),

  create: name => axios.post('/channels', { name }).then(res => res.data),

  rename: (id, name) => axios.patch(`/channels/${id}`, { name }).then(res => res.data),

  delete: id => axios.delete(`/channels/${id}`).then(() => id),
}
