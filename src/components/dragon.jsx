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