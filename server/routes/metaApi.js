const baseUri =
  // process.env.NODE_ENV === 'development'
  // ? 'http://localhost:6660' :
  'https://nft.syn.city'


const description = 'The Genesis Blueprints will form the backbone of the in-game characters while providing incentives and perks within the Syn City ecosystem. Genesis Blueprints will be upgradable through various mechanisms including training, modifying, PvE & PvP battles, farming, borrowing/lending, staking and Gacha mechanics'

const metaApi = {

  synPassMetadata(res, id) {
    return {
      tokenId: id,
      name: 'Syn City Genesis Pass #' + id,
      description: 'The OG Genesis key to the entire SYN CITY #MafiaMetaverse and beyond',
      image: baseUri + '/nft/SYNP/syn-city-genesis-pass.png',
      external_url: baseUri + '/syn-city-passes',
      attributes: [
        {
          trait_type: 'Status',
          value: 'Unrevealed'
        }
      ],
      extend_info: {
        videoUrl: baseUri + '/nft/SYNP/syn-city-genesis-pass.mp4'
      },
      animation_url: baseUri + '/nft/SYNP/syn-city-genesis-pass.mp4'
    }
  },

  synCouponMetadata(res, id) {
    return {
      tokenId: id,
      name: 'Limited Edition Blueprint #' + id,
      description,
      image: baseUri + '/nft/SYNBC/syn-city-blueprint-coupon.png',
      external_url: baseUri + '/syn-city-blueprint-coupons',
      attributes: [
        {
          trait_type: 'Status',
          value: 'Unrevealed'
        }
      ],
      extend_info: {
        videoUrl: baseUri + '/nft/SYNBC/syn-city-blueprint-coupon.mp4'
      },
      animation_url: baseUri + '/nft/SYNBC/syn-city-blueprint-coupon.mp4'
    }
  },

  synBlueprintsMetadata(res, symbol, id) {
    return {
      tokenId: id,
      name: 'Syn City Genesis Blueprint #' + id,
      description,
      image: baseUri + '/nft/SYNB/syn-city-blueprint.png',
      external_url: baseUri + '/syn-city-blueprints',
      attributes: [
        {
          trait_type: 'Status',
          value: 'Unrevealed'
        }
      ],
      extend_info: {
        videoUrl: baseUri + '/nft/SYNB/syn-city-blueprint.mp4'
      },
      animation_url: baseUri + '/nft/SYNB/syn-city-blueprint.mp4'
    }
  },

  getMetadata(res, req) {
    const {symbol, id} = req.params
    switch (symbol) {
      case 'SYNP':
        return this.synPassMetadata(res, id)
      case 'SYNBC':
        return this.synCouponMetadata(res, id)
      case 'SYNB':
        return this.synBlueprintsMetadata(res, symbol, id)
    }
  },

  synPassContractMetadata(res, id) {
    return {
      name: 'Syn City Genesis Passes',
      description: 'The OG Genesis key to the entire SYN CITY #MafiaMetaverse and beyond',
      image: baseUri + '/nft/SYNP/syn-city-genesis-pass.png',
      external_link: baseUri +  +'/passes',
      seller_fee_basis_points: 200,
      fee_recipient: '0x41BDD852d3618Dc5D6338279F373Bf7935dc0242'
    }

  },

  synCouponContractMetadata(res, id) {
    return {
      name: 'Limited Edition Blueprints',
      description: 'Coupons to redeem Syn City Genesis Blueprints',
      image: baseUri + '/nft/SYNBC/syn-city-blueprint-coupon.png',
      external_link: baseUri +  +'/coupons',
      seller_fee_basis_points: 200,
      fee_recipient: '0x41BDD852d3618Dc5D6338279F373Bf7935dc0242'
    }

  },

  synBlueprintsContractMetadata(res, symbol, id) {
    return {
      name: 'Syn City Genesis Blueprints',
      description: 'Syn City Genesis Blueprints',
      image: baseUri +  +'/blueprints.png',
      external_link: baseUri +  +'/blueprints',
      seller_fee_basis_points: 200,
      fee_recipient: '0x41BDD852d3618Dc5D6338279F373Bf7935dc0242'
    }

  },

  getContractMetadata(res, req) {
    const {symbol, id} = req.params
    switch (symbol) {
      case 'SYNP':
        return this.synPassContractMetadata(res, id)
      case 'SYNBC':
        return this.synCouponContractMetadata(res, id)
      default:
        return this.synBlueprintsContractMetadata(res, symbol, id)
    }
  }

}


module.exports = metaApi

