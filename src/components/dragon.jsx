import React, {
    useEffect,
    useRef,
    useMemo,
    useState,
    } from 'react'

import * as THREE from 'three'

import { useThree, useFrame } from '@react-three/fiber'

import {
    useGLTF,
    useTexture,
    useAnimations,
    ContactShadows,
    Sparkles,
} from '@react-three/drei'

import {
    EffectComposer,
    Bloom,
    ChromaticAberration,
    Noise,
    Vignette,
    } from '@react-three/postprocessing'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP)
gsap.registerPlugin(ScrollTrigger)

const MODEL_PATH = '/models/model.glb'
const NORMAL_MAP_PATH = '/MI_M_B_44_Qishilong_body02_2_Inst_normal.png'

const MATCAP_PATHS = [
    '/matcap/mat-1.png', '/matcap/mat-2.png', '/matcap/mat-3.png', '/matcap/mat-4.png',
    '/matcap/mat-5.png', '/matcap/mat-6.png', '/matcap/mat-7.png', '/matcap/mat-8.png',
    '/matcap/mat-9.png', '/matcap/mat-10.png', '/matcap/mat-11.png', '/matcap/mat-12.png',
    '/matcap/mat-13.png', '/matcap/mat-14.png', '/matcap/mat-15.png', '/matcap/mat-16.png',
    '/matcap/mat-17.png', '/matcap/mat-18.png', '/matcap/mat-19.png', '/matcap/mat-20.png',
]

useGLTF.preload(MODEL_PATH)
useTexture.preload(NORMAL_MAP_PATH)
MATCAP_PATHS.forEach((path) => useTexture.preload(path))

const Dragon = () => {
    const group = useRef(null)
    const dragonModel = useRef(null)
    const [lightTint, setLightTint] = useState({ primary: '#ffffff', secondary: '#88bbff' })

    const shaderUniforms = useRef({